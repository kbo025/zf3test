<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Application\Models\Client;

class ClientsController extends AbstractActionController
{
    public function indexAction()
    {
        //$this->view->headScript()->appendFile($this->view->baseUrl('js/vendor/extjs/build/ext-all.js'));
        //$this->view->headScript()->appendFile($this->view->baseUrl('js/ClientModule.js'));
        //$this->view->headLink()->appendStylesheet('js/vendor/extjs/resources/zf3app-all.css');
        return new ViewModel();
    }

    public function searchAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client($this->getRequest()->getParams());
            $data = $client->search(); 
            if ($data)
                return new JsonModel(['code' => 201, 'message' => 'OK', 'data' => $data]);
            else
                return new JsonModel(['code' => 400, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }

    public function saveAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client($this->getRequest()->getParams());
            if ($client->save())
                return new JsonModel(['code' => 201, 'message' => 'OK']);
            else
                return new JsonModel(['code' => 400, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }

    public function deleteAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client($this->getRequest()->getParams());
            if ($client->delete())
                return new JsonModel(['code' => 201, 'message' => 'OK']);
            else
                return new JsonModel(['code' => 400, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }

    public function testclientsAction()
    {
        $response = [];
        for ($i=1; $i<=50; $i++) {
            $response[] = [
                'id' => $i,
                'name' => 'user '.$i,
                'identification' => $i.$i.$i,
                'email' => 'Email'.$i.'@gmail.com',
                'phonePrimary' => $i.$i.$i,
                'phoneSecondary' => $i.$i.$i,
                'fax' => '',
                'mobile' => '',
                'observations' => $i.$i.$i,
                'type' => 'client',
                'address' => $i.$i.$i,
                'seller' => [],
                'term' => [],
                'priceList' => [],
                'internalContacts' => []
            ];
        }
        return new JsonModel($response);
    }
}
